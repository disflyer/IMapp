import { z } from "zod";
import EventEmitter, { on } from 'node:events';

import {
  createTRPCRouter,
  publicProcedure,
} from "server/api/trpc";


interface MyEvents {
  add: (channelId: string, data) => void;
}
declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {
  public toIterable<TEv extends keyof MyEvents>(
    event: TEv,
  ): AsyncIterable<Parameters<MyEvents[TEv]>> {
    return on(this, event) as any;
  }
}

export const ee = new MyEventEmitter();

export const channelRouter = createTRPCRouter({

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.channel.findMany();
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.db.channel.create({
        data: {
          name: input.name,
        }
      })

      return channel!.id;
    }),

});
