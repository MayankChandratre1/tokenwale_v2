import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { ChevronDown, XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";

const AddStaffModal = () => {
  const [open, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    role: "Super Admin" | "Manager" | "Admin" | "Staff";
    email: string;
    permissions: "Add Staff" | "All Permissions";
  }>({
    name: "",
    role: "Super Admin",
    email: "",
    permissions: "Add Staff",
  });

  const addStaff = async () => {
    try{
      alert(`${formData.name} added as a ${formData.role}`)
      setIsOpen(false)
    }catch(err){
      console.log(err);
      alert(`Something went wrong`)
    }
  }


  

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#38f68f] hover:bg-[#38f68f] text-black">
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden h-[90vh] border-0 bg-transparent text-white md:w-screen  ">
        <DialogHeader className="w-full md:px-10 md:pt-2 md:pb-16 rounded-[50px] border border-gray-600 dashboard-card-bg bg-opacity-30 backdrop-blur-lg ">
          <DialogTitle className="mb-4 relative flex justify-between text-[16px] text-white md:text-[24px] pt-12">
            <p className="text-[#38f68f]">Add Staff</p>
            <Button
              variant={"ghost"}
              className="hover:bg-transparent hover:text-[#fff]"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <XIcon size={16} />
            </Button>
          </DialogTitle>
          <DialogDescription className="space-y-4 text-white">
            <div className="w-full grid grid-cols-4 gap-4">
              <label className="my-auto font-semibold">FULL NAME :</label>
              <input
                name="name"
                className="px-3 py-2 rounded-md bg-[#38f68f55] flex-1 block col-span-3  "
                onChange={onChange}
                value={formData.name}
              />
            </div>

            <div className="w-full grid grid-cols-4 gap-4">
              <label className="mt-2 font-semibold">ROLE :</label>
              <div className="col-span-3">
                    <Button className="w-full flex justify-between bg-[#38f68f55] text-white hover:bg-[#38f68f55]">
                        {formData.role}
                        <ChevronDown />
                    </Button>
                    <div className="rounded-md mt-2 bg-[#38f68f55] text-white hover:bg-[#38f68f55] ">
                        <div className="w-full flex gap-2 items-center px-3 py-2">
                            <input
                                 type="checkbox"
                                 className="bg-none accent-[#38f68f] w-4 h-4 border-[#38f68f]"
                                 value={"Super Admin"}
                                 checked={formData.role == "Super Admin"}
                                 name="role"
                                 onChange={onChange}
                            />
                            <p>Super Admin</p>
                        </div>
                        <div className="w-full flex gap-2 items-center px-3 py-2">
                            <input
                                 type="checkbox"
                                 className="bg-none accent-[#38f68f] w-4 h-4 border-[#38f68f]"
                                 value={"Manager"}
                                 checked={formData.role == "Manager"}
                                 name="role"
                                 onChange={onChange}
                            />
                            <p>Manager</p>
                        </div>
                        <div className="w-full flex gap-2 items-center px-3 py-2">
                            <input
                                 type="checkbox"
                                 className="bg-none accent-[#38f68f] w-4 h-4 border-[#38f68f]"
                                 value={"Admin"}
                                 checked={formData.role == "Admin"}
                                 name="role"
                                 onChange={onChange}
                            />
                            <p>Admin</p>
                        </div>
                        <div className="w-full flex gap-2 items-center px-3 py-2">
                            <input
                                 type="checkbox"
                                 className="bg-none accent-[#38f68f] w-4 h-4 border-[#38f68f]"
                                 value={"Staff"}
                                 checked={formData.role == "Staff"}
                                 name="role"
                                 onChange={onChange}
                            />
                            <p>Staff</p>
                        </div>
                    </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-4 gap-4">
              <label className="my-auto font-semibold">EMAIL :</label>
              <input
                name="email"
                className="px-3 py-2 rounded-md bg-[#38f68f55] flex-1 block col-span-3  "
                onChange={onChange}
                value={formData.email}
              />
            </div>

            <div className="w-full grid grid-cols-4 gap-4">
              <label className="my-auto font-semibold">PERMISSIONS:</label>
              <Select onValueChange={(val) => {
                setFormData({
                    ...formData,
                    permissions: val as "All Permissions" | "Add Staff"
                })
              }}>
                <SelectTrigger className="m-0 col-span-3   border-none px-3 py-2 rounded-md bg-[#26a760] flex-1 text-white">
                  <SelectValue placeholder="Add Staff" />
                </SelectTrigger>
                <SelectContent className="m-0 border-none px-3 py-2 rounded-md bg-[#26a760] flex-1 text-white p-0">
                  <SelectItem className="m-0 rounded-none border-none px-3 py-2 flex-1 text-white" value="Add Staff">Add Staff</SelectItem>
                  <SelectItem className="m-0 rounded-none border-none px-3 py-2 flex-1 text-white" value="All Permissions">All Permissions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full flex justify-center pt-5">
                <Button onClick={addStaff} className="bg-[#38f68f] hover:bg-[#38f68f] text-black">
                Add Staff
                </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffModal;
