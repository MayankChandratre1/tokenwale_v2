import AdminNav from '@/app/_components/admin/AdminNav'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import "../../../styles/scroll.css"
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { api } from '@/trpc/react'
import AddStaffModal from '@/app/_components/admin/AddStaffModal'

const AdminProfilePage = () => {
  const [isPhoneOtpVisible, setIsPhoneOtpVisible] = useState(false);
  const [isEmailOtpVisible, setIsEmailOtpVisible] = useState(false);
  const [isPhoneOtpVerified, setIsPhoneOtpVerified] = useState(false);
  const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false);
   const router = useRouter()
      const handleLogout = async () => {
          try {
            await signOut({ redirect: false });
            await router.push("/");
          } catch (error) {
            console.error("Error during logout:", error);
          }
        };

        const [formdata, setData] = useState({
          name: "",
          phone: "",
          email: "",
          address: "",
          role: "",
          adminId: "",
          permissions: "All Permissions" 
        })

  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...formdata,
        [e.target.name]:e.target.value
      })
  }
  const utils = api.useUtils();
  const { mutate: updateUserDetails } = api.user.editUserDetails.useMutation({
      onSuccess: async (data) => {
        console.log(data);
        await utils.user.getUserDetailsByUserId.invalidate();
        await utils.txn.getLatestTxnByUserIdInf.invalidate();
      },
    });

    const handleSave = async () => {
      try{
         updateUserDetails({key:"name", value:formdata.name})
      }catch(err){
        console.log(err);
      }
    }


    const { data: userDetails } = api.user.getUserDetailsByUserId.useQuery();
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [otpEmail, setOtpEmail] = useState(Array(6).fill(""));


    useEffect(()=>{
      if(userDetails){
        setData({
          ...formdata,
          name: userDetails?.name,
          phone: userDetails.phone,
          email: userDetails.email,
          adminId:userDetails.userId,
          role: userDetails.role
        })
      }
    }, [userDetails])
  
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(0, 1); // Restrict input to a single character
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    // Move to the next input automatically
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to the previous input on backspace if the current input is empty
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  const handleOtpChangeEmail = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(0, 1); // Restrict input to a single character
    const newOtp = [...otpEmail];
    newOtp[index] = value;
    setOtpEmail(newOtp);
  
    // Move to the next input automatically
    if (value && index < 5) {
      document.getElementById(`otp-email-${index + 1}`)?.focus();
    }
  };
  
  const handleOtpKeyDownEmail = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpEmail[index] && index > 0) {
      // Move to the previous input on backspace if the current input is empty
      document.getElementById(`otp-email-${index - 1}`)?.focus();
    }
  };

  const { mutate: sendPhoneOtp } = api.otp.sendOtpMobile.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const handleGeneratePhoneOtp = () => {
    try {
      sendPhoneOtp({ phone: formdata.phone });
      setIsPhoneOtpVisible(true);
    } catch (error) {
      console.error("Error sending email OTP:", error);
    }
  };

  const { mutate: verifyEmailOtp } = api.otp.verifyOtp.useMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data.success == true) {
        updateUserDetails({
          key: "email",
          value: formdata.email,
          otp: otpEmail.join(""),
        });
      } else {
        alert("wrong otp");
      }
      setIsEmailOtpVerified(true);
    },
  });
  const { mutate: verifyMobileOtp } = api.otp.verifyOtp.useMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data.success == true) {
        updateUserDetails({
          key: "phone",
          value: parseInt(formdata.phone),
          otp: otp.join(""),
        });
      } else {
        alert("wrong otp");
      }
      setIsPhoneOtpVerified(true);
    },
  });

  return (
    <div className="text-white min-h-screen bg-black scroll-bar-custom">
      <AdminNav setAddNote={(text)=>console.log(text)
         } toggleSidebar={()=>{
            console.log("Print");
            
         }} handleSearch={(userId) => {console.log(userId);
         }} />
    <div className="pt-20 min-h-screen h-screen  px-4 pb-4">
      <div className="h-full max-h-[700px] relative scroll-bar-custom overflow-y-auto rounded-md p-12 bg-[#38f68f] bg-opacity-20 backdrop-blur-sm">
        <div className="absolute top-4 right-4">
            <Link href={"/admin-dashboard"}>
              <XIcon size={32} color="#ffffff" />
            </Link>
        </div>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl text-[#38f68f]">PROFILE </h2>
              <AddStaffModal />
          </div>

          <div className="space-y-4 mt-3 text-lg">
              <div className='w-full flex gap-24 items-center justify-between'>
                <label>Name :</label>
                <input name='name' className='px-3 py-2 rounded-md bg-[#38f68f55] flex-1' onChange={onChange} value={formdata.name} />
              </div>
              <div className='w-full flex gap-24 items-center justify-between'>
                <label>PHONE NUMBER :</label>
                <input name='phone' className='px-3 py-2 rounded-md bg-[#38f68f55] flex-1' onChange={onChange} value={formdata.phone} />
              </div>
              <div className='w-full flex gap-24 items-center justify-between'>
                <label>EMAIL ID :</label>
                <input name='email' className='px-3 py-2 rounded-md bg-[#38f68f55] flex-1' onChange={onChange} value={formdata.email} />
              </div>
             
              <div className='w-full flex gap-24 items-center justify-between'>
                <label>ADMIN ID :</label>
                <input disabled className='px-3 py-2 rounded-md bg-[#38f68f55] flex-1' onChange={onChange} value={formdata.adminId} />
              </div>
              <div className='w-full flex gap-24 items-center justify-between'>
                <label>PERMISSIONS :</label>
                <input disabled className='px-3 py-2 rounded-md bg-[#38f68f55] flex-1' onChange={onChange} value={formdata.permissions} />
              </div>
              <div className='w-full flex gap-24 items-center justify-between'>
                <label>ROLE :</label>
                <input disabled className='px-3 py-2 rounded-md bg-[#38f68f55] flex-1' onChange={onChange} value={formdata.role} />
              </div>

              <div className='pt-8 flex justify-end'>
                  <Button onClick={handleSave} className='bg-[#38f68f] hover:bg-[#38f68f] text-black'>Save</Button>
              </div>
          </div>

          <div className='mt-12 flex justify-end'>
            <Button onClick={handleLogout} className='bg-transparent hover:bg-transparent border-2 border-red-500 text-red-500'>Logout</Button>
          </div>
          
      </div>
      </div>
    </div>
  )
}

export default AdminProfilePage