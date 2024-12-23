import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { XIcon } from 'lucide-react'
import React, { useState } from 'react'

const DeleteModal = ({handleDelete}:{
    handleDelete:() => void
}) => {
    const [open, setIsOpen] = useState(false)
    return (
    <Dialog open={open} onOpenChange={setIsOpen} >
        <DialogTrigger asChild>
            <Button variant={"destructive"} className="text-sm">
                Deactivate Account
              </Button>
        </DialogTrigger>
        <DialogContent showOverlay={false}  className="[&>button]:hidden h-[50vh] border-0 bg-transparent text-white md:w-screen md:max-w-fit ">
          <DialogHeader className="md:px-16 md:pt-2  rounded-[50px] border border-gray-600 dashboard-card-bg bg-opacity-30 backdrop-blur-lg ">
            <DialogTitle className="mb-4 text-center relative flex justify-between text-[16px] text-white md:text-[32px] pt-12">
                Are you sure you want to delete this account?
            </DialogTitle>
            <DialogDescription className='flex-1 pb-14 flex justify-center items-end gap-6 text-lg'>
              <Button onClick={()=>{
                handleDelete()
              }} variant={"destructive"} className="text-lg">
                Yes, Delete
              </Button>
              <Button onClick={()=>{
                setIsOpen(false)
              }} className='text-lg bg-transparent hover:bg-transparent border-2 border-red-500 text-red-500'>No</Button>
            </DialogDescription>
            </DialogHeader>
            </DialogContent>
            </Dialog>
  )
}

export default DeleteModal