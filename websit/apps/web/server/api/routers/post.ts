import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "server/api/trpc";
import { ee } from "./channel";
import { sse } from '@trpc/server';
export const postRouter = createTRPCRouter({
  add: publicProcedure
    .input(
      z.object({
        channelId: z.string(),
        author: z.string(),
        content: z.string().trim().min(1),
      }),
    )
    .mutation(async (opts) => {
      const { channelId } = opts.input;

      const post = await opts.ctx.db.post.create({
        data: {
          content: opts.input.content,
          author: opts.input.author,
          channelId,
        }
      })

      ee.emit('add', channelId, post);

      return post;
    }),

  onAdd: publicProcedure
    .input(
      z.object({
        channelId: z.string(),
        lastEventId: z.string().nullish(),
      }),
    )
    .subscription(async function* (opts) {
      let lastMessageCursor: Date | null = null;

      const eventId = opts.input.lastEventId;
      if (eventId) {
        const itemById = await opts.ctx.db.post.findFirst({
          where: {
            id: eventId
          },
        });
        lastMessageCursor = itemById?.createdAt ?? null;
      }

      let unsubscribe = () => { };

      const stream = new ReadableStream({
        async start(controller) {
          const onAdd = (channelId: string, data) => {
            if (channelId === opts.input.channelId) {
              controller.enqueue(data);
            }
          };
          ee.on('add', onAdd);
          unsubscribe = () => {
            ee.off('add', onAdd);
          };

          const newItemsSinceCursor = await opts.ctx.db.post.findMany({
            where: {
              channelId: opts.input.channelId,
              createdAt: lastMessageCursor ?? undefined
            },
            orderBy: {
              createdAt: "desc"
            }
          });

          for (const item of newItemsSinceCursor) {
            controller.enqueue(item);
          }
        },
        cancel() {
          unsubscribe();
        },
      });

      for await (const post of streamToAsyncIterable(stream)) {
        yield sse({
          id: post.id,
          data: post,
        });
      }
    }),

});


function streamToAsyncIterable<TValue>(
  stream: ReadableStream<TValue>,
): AsyncIterable<TValue> {
  const reader = stream.getReader();
  const iterator: AsyncIterator<TValue> = {
    async next() {
      const value = await reader.read();
      if (value.done) {
        return {
          value: undefined,
          done: true,
        };
      }
      return {
        value: value.value,
        done: false,
      };
    },
    async return() {
      await reader.cancel();
      return {
        value: undefined,
        done: true,
      };
    },
  };

  return {
    [Symbol.asyncIterator]: () => iterator,
  };
}