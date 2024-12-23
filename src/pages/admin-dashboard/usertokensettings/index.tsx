import UserModal from "@/app/_components/admin/UserModal";
import { Navbar } from "@/app/_components/common/Navbar";
import { api } from "@/trpc/react";
import { userName } from "@/utils/random";
import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const UserTokenSettings = () => {
  const [userIds, setUserIds] = useState<string[]>([]);
  const { mutate, isPending } = api.user.findUserByUserId.useMutation({
    onSuccess: (data) => {
      setUserIds(data.map((e) => e));
    },
  });

  const handleSearch = (userId: string) => {
    if (userId.toString().length < 5) {
      setUserIds([]);
      return;
    }
    mutate({ userId });
  };

  return (
    <div className="dashboard-card-bg min-h-screen">
      <Navbar />
      <div className="pt-20">
        <h2 className="text-4xl text-white px-4 py-2">User Settings</h2>
        <div>
          <div className="relative px-3 w-full">
            <input
              type="number"
              placeholder="Search By USER ID"
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
            {userIds.map(userId => (
              <div key={userId} className="text-white px-8 mt-4 flex gap-4">
                <p className="text-2xl">{userName(userId)}</p>
                <Link href={`/admin-dashboard/usertokensettings/${userId}`}>
                  <Settings color="#38f68f" size={32} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTokenSettings;
