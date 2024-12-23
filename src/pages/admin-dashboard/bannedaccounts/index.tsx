import AdminNav from "@/app/_components/admin/AdminNav";
import UserModal from "@/app/_components/admin/UserModal";
import { Navbar } from "@/app/_components/common/Navbar";
import { api } from "@/trpc/react";
import { userName } from "@/utils/random";
import { Divide, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BannedAccounts = () => {
  const [userIds, setUserIds] = useState<string[]>([]);
  const { mutate, isPending } = api.user.findUserByUserId.useMutation({
    onSuccess: (data) => {
      setUserIds(data.map((e) => e));
    },
  });

  const {data:bannedUsers} = api.admin.getAllBannedUsers.useInfiniteQuery({
    limit: 10
  },
  {
    getNextPageParam: (last) => last.lastVisible,
    getPreviousPageParam: (prev) => prev.lastVisible,
  })

  const {mutate:searchBannedUsers} = api.admin.findBannedUserByUserId.useMutation({
    onSuccess: (data) => {
        setUserIds(data.map((e) => e));
      },
  })

  const handleSearch = (userId: string) => {
    if (userId.toString().length < 3) {
      setUserIds([]);
      return;
    }
    searchBannedUsers({ userId });
  };

  return (
    <div className="dashboard-card-bg min-h-screen">
      <AdminNav />
      <div className="pt-20">
        <h2 className="text-4xl text-white px-4 py-2">User Settings</h2>
        <div>
          <div className="relative px-3 w-full">
            <input
              type="number"
              placeholder="Recent"
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full my-3 border-b-[1px] border-[#38F68F] bg-transparent px-4 sm:px-4 py-4 sm:pr-12 text-white outline-none"
            />
            <button className="rounded-[0 12px 12px 0] absolute right-0 top-0 h-full px-4 text-black">
              <Image
                alt=""
                height={18}
                width={18}
                src="/icons/search-icon.svg"
              />
            </button>
          </div>

          <div>
            {userIds.length > 0 && userIds.map(userId => (
              <div key={userId} className="text-white px-8 mt-4 flex gap-4">
                <p className="text-2xl">{userName(userId)}</p>
                <Link href={`/admin-dashboard/usertokensettings/${userId}`}>
                  <Settings color="#38f68f" size={32} />
                </Link>
              </div>
            ))}
            {userIds.length <= 0 && bannedUsers && bannedUsers.pages[0]?.all.map(user => (
              <div key={user.userId} className="text-white px-8 mt-4 flex gap-4">
                <p className="text-2xl">{userName(user.userId)}</p>
                <Link href={`/admin-dashboard/usertokensettings/${user.userId}`}>
                  <Settings color="#38f68f" size={32} />
                </Link>
              </div>
            ))}
            {userIds.length <= 0 && bannedUsers && bannedUsers.pages[0]?.all.length == 0 && (
                <div className="italic mt-12 text-center text-gray-500">
                    No Banned Users
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannedAccounts;
