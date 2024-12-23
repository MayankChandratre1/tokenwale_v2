import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { permission } from "process";




export const adminRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllUsers: protectedProcedure
    .input(z.object({limit: z.number().min(1).max(100).default(50), cursor: z.string().min(1).nullish()}))
    .query(async ({ctx, input}) => {
        const {limit, cursor} = input
        let q = ctx.db.collection('users').limit(limit +1)
        const cursordoc = cursor ? await ctx.db.collection('users').doc(cursor).get():null
        let lastVisible: string | null = null
        try{
            if(cursor){
              q = q.startAfter(cursordoc)  
            }
            const all = (await q.get()).docs
            const data  = all.map((doc)=>{
                return doc.data()
            })
            if(data.length > limit){
              const nextItem = all.pop()
              data.pop()
              lastVisible= nextItem?.id ?? ""
            }
            return {error: false, all:data, lastVisible:lastVisible}
        }catch(e){
            return {error:e, all: [], lastVisible:""}
        }
    }),

  banUserById: protectedProcedure
    .input(z.object({
      userId:z.string()
    }))
    .mutation(async ({ctx, input}) => {
        const {userId} = input
        const user = await ctx.db.collection('users').where('userId','==',userId).get()
        
        try{
            const userRef =  user.docs[0]?.ref
            if(!userRef){
              throw Error('No User Selected')
            }
            await userRef.update({
              banned:true
            })
            await ctx.db.collection('banned').add({
              userId: user.docs[0]?.data().userId,
              email: user.docs[0]?.data().email,
              phone: user.docs[0]?.data().phone,
            })
            
            return {error: false}
        }catch(e){
            return {error:e, all: [], lastVisible:""}
        }
    }),
  disBanUserById: protectedProcedure
    .input(z.object({
      userId:z.string()
    }))
    .mutation(async ({ctx, input}) => {
        const {userId} = input
        const user = await ctx.db.collection('users').where('userId','==',userId).get()
        const bannedDoc = await ctx.db.collection('banned').where('userId','==',userId).get()
        try{
            const userRef =  user.docs[0]?.ref
            if(!userRef){
              throw Error('No User Selected')
            }
            await userRef.update({
              banned:false
            })
            await bannedDoc.docs[0]?.ref.delete()
            return {error: false}
        }catch(e){
            return {error:e, all: [], lastVisible:""}
        }
    }),
  deactivateUserById: protectedProcedure
    .input(z.object({
      userId:z.string()
    }))
    .mutation(async ({ctx, input}) => {
        const {userId} = input
        const user = await ctx.db.collection('users').where('userId','==',userId).get()
        
        try{
            const userRef =  user.docs[0]?.ref
            if(!userRef){
              throw Error('No User Selected')
            }
            await ctx.db.collection('deactivated').add({
              ...user.docs[0]?.data()
            })
            await userRef.delete()
            return {error: false}
        }catch(e){
            return {error:e, all: [], lastVisible:""}
        }
    }),
    getAllBannedUsers: protectedProcedure
    .input(z.object({limit: z.number().min(1).max(100).default(50), cursor: z.string().min(1).nullish()}))
    .query(async ({ctx, input}) => {
        const {limit, cursor} = input
        let q = ctx.db.collection('banned').limit(limit +1)
        const cursordoc = cursor ? await ctx.db.collection('banned').doc(cursor).get():null
        let lastVisible: string | null = null
        try{
            if(cursor){
              q = q.startAfter(cursordoc)  
            }
            const all = (await q.get()).docs
            const data  = all.map((doc)=>{
                return doc.data()
            })
            if(data.length > limit){
              const nextItem = all.pop()
              data.pop()
              lastVisible= nextItem?.id ?? ""
            }
            return {error: false, all:data, lastVisible:lastVisible}
        }catch(e){
            return {error:e, all: [], lastVisible:""}
        }
    }),
    findBannedUserByUserId: protectedProcedure
    .input(
      z.object({ userId: z.string(), limit: z.number().min(5).default(5) }),
    )
    .mutation(async ({ ctx, input }) => {
      const matchedUserIds: string[] = [];
      const usersRef = ctx.db.collection("banned");
      const query = usersRef
        .where("userId", ">=", input.userId)
        .where("userId", "<", input.userId + "\uf8ff")
        .orderBy("userId")
        .limit(input.limit);
      const snapshot = await query.get();
      snapshot.forEach((doc) => {
        const userId = doc.get("userId") as string;
        if (typeof userId === "string" && userId.includes(input.userId)) {
          matchedUserIds.push(userId);
        }
      });
      return matchedUserIds;
    }),
  addAdmin: protectedProcedure
    .input(z.object({
      name:z.string(),
      email:z.string(),
      role:z.enum(["Super Admin","Admin","Manager","Staff"]).default("Super Admin"),
      permissions:z.enum(["Add Staff", "All Permissions"]).default("Add Staff")
    }))
    .mutation(async ({ctx, input}) => {
        const {name, email, role, permissions} = input
        const user = await ctx.db.collection('users').where('userId','==',"").get()
        const admin = await ctx.db.collection('admins').add({
          name,
          email,
          role,
          permissions
        })
        try{
            const userRef =  user.docs[0]?.ref
            if(!userRef){
              throw Error('No User Selected')
            }
            await ctx.db.collection('deactivated').add({
              ...user.docs[0]?.data()
            })
            await userRef.delete()
            return {error: false}
        }catch(e){
            return {error:e, all: [], lastVisible:""}
        }
    })
});
