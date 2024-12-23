import { formatFirestoreTimestamp, getAmountAfterTxnCost } from '@/utils/random';
import { api } from '@/trpc/react';
import { userName } from '@/utils/random';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Timestamp } from 'firebase/firestore';
import FilterModal from '@/app/_components/admin/FilterModal';
import { Download, Loader2 } from 'lucide-react';
import "../../../styles/scroll.css"

const RecentTransfer = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [rows, setRows] = useState(3)
    const [dateFilter, setDateFilter] = useState<Date[] | null>(null)
    const [timeFilter, setTimeFilter] = useState<number[]>([0,0])
    const [transfers, setTransfers] = useState<"global" | "user" | "burnt">("global")
    const [loading, setLoading] = useState(true)
    const [txns, setTxns] = useState<{
        firestoreId: string;
        amount: number;
        from: string;
        id: string;
        timestamp: Timestamp;
        to: string;
    }[]>([])

          
    

    const {
        data: txn,
        fetchNextPage,
        hasNextPage,
        hasPreviousPage,
        isPending:burntIsPending
      } = api.txn.getLatestTxnBurntInf.useInfiniteQuery(
        {
          limit: rows,
        },
        {
          getNextPageParam: (last) => last.lastVisible,
          getPreviousPageParam: (prev) => prev.lastVisible,
        },
      );

      const {
        data: txnsGlobal,
        fetchNextPage:fetchNextAllUsers,
        isPending:globalIsPending
      } = api.txn.getLatestTxnInf.useInfiniteQuery(
        {
          limit: rows,
        },
        {
          getNextPageParam: (last) => last.lastVisible,
          getPreviousPageParam: (prev) => prev.lastVisible,
        },
      );

      const {
        data: txnsUser,
        fetchNextPage:fetchNextAllTrans,
        isPending:userIsPending
      } = api.txn.getLatestTxnByUserIdInf.useInfiniteQuery(
        {
          limit: rows,
        },
        {
          getNextPageParam: (last) => last.lastVisible,
          getPreviousPageParam: (prev) => prev.lastVisible,
        },
      );
      

      useEffect(()=>{
        setTxns([])
        setLoading(true)
        if(transfers == 'global'){
            setTxns(txnsGlobal?.pages[currentPage-1]?.transactions ?? [])
            if(dateFilter){
              const newTxns = txnsGlobal?.pages[currentPage-1]?.transactions.filter(txn => {
                  const formatedDate = formatFirestoreTimestamp(txn.timestamp)?.date
                  if(!formatedDate) return false
                  const dateFilterArray = dateFilter.map(date => {
                      return new Date(date).toLocaleDateString('en-GB', { day: "2-digit", month: "2-digit", year: "2-digit" });
                    })
                  
                  return dateFilterArray.includes(formatedDate)
              })
              
              setTxns(newTxns ?? [])
          }
          
        }
        if(transfers == 'burnt'){
            setTxns(txn?.pages[currentPage-1]?.transactions.filter(txn => txn.to.toLowerCase() == '00000000' ) ?? [])
            if(dateFilter){
              const newTxns = txn?.pages[currentPage-1]?.transactions.filter(txn => {
                  const formatedDate = formatFirestoreTimestamp(txn.timestamp)?.date
                  if(!formatedDate) return false
                  const dateFilterArray = dateFilter.map(date => {
                      return new Date(date).toLocaleDateString('en-GB', { day: "2-digit", month: "2-digit", year: "2-digit" });
                    })
                  
                  return dateFilterArray.includes(formatedDate)
              })
             
              setTxns(newTxns ?? [])
          }
          
          }
          if(transfers == 'user'){
            setTxns(txnsUser?.pages[currentPage-1]?.transactions ?? [])
            if(dateFilter){
              const newTxns = txnsUser?.pages[currentPage-1]?.transactions.filter(txn => {
                  const formatedDate = formatFirestoreTimestamp(txn.timestamp)?.date
                  if(!formatedDate) return false
                  const dateFilterArray = dateFilter.map(date => {
                      return new Date(date).toLocaleDateString('en-GB', { day: "2-digit", month: "2-digit", year: "2-digit" });
                    })
                  
                  return dateFilterArray.includes(formatedDate)
              })
              
              setTxns(newTxns ?? [])
          }
            console.log(txn?.pages[currentPage-1]?.transactions ?? []);
          }
          setLoading(false)
      }, [txn, transfers, currentPage,rows, dateFilter])

  

      const filterByTime = (txns:{
        firestoreId: string;
        amount: number;
        from: string;
        id: string;
        timestamp: Timestamp;
        to: string;
    }[] | undefined) => {
        if(timeFilter.filter(time => time != 0).length > 1 && txns){
          const newTxns = txns.filter((txn) => {
            const time = formatFirestoreTimestamp(txn.timestamp)?.time.split(":") ?? []
            if(time && time.length > 1){
              const min = parseInt(time[1] ?? "2")
              const hr = parseInt(time[0] ?? "2")
                return min == timeFilter[1] && hr == timeFilter[0]
            }
            return true
          })
          return newTxns
        }
        return null
      }

      const handleNextPage = async () => {
        switch(transfers){
            case "user": await fetchNextAllTrans();
                break;
            case "global": await fetchNextAllUsers();
                break;
            case "burnt": await fetchNextPage();
                break;
        }
        
        setCurrentPage((prev) => prev + 1);
      };
    
      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
  return (
    <div className='px-5 pb-5 pt-0 mb-3'>
        <div className={`flex flex-col gap-4 text-white md:flex-row ${rows == 9 ? "mt-8":"mt-0"}`}>
          <div className="flex max-h-[500px] mt-10 w-full flex-col items-center justify-center md:w-full">
            <div className="flex w-full  flex-row justify-between gap-12 pb-6">
              <p className='text-xl'>Recent Transfers</p>
              <div className='flex gap-2 items-center'>
                <FilterModal setDateFilter={setDateFilter} setTime={setTimeFilter} />
                <Button className='bg-[#38f68f] hover:bg-[#38f68f] text-black'>
                  <Download className='w-5 h-5 mr-2'/>
                  Export to CSV
                </Button>
              </div>
            </div>
            <div className='flex  justify-start max-w-[90vw] w-full gap-2 flex-wrap'>
                <Button className={`text-[10px] md:text-[18px] rounded-none ${transfers == 'global' ? "bg-[#38f28f] text-black hover:bg-[#38f68faa]":"bg-transparent text-white hover:bg-transparent" }`} onClick={()=>{
                    setTransfers('global')
                    setCurrentPage(1)
                }}>Global Transfers</Button>
                <Button className={` text-[10px] md:text-[18px] rounded-none ${transfers == 'user' ? "bg-[#38f28f] text-black hover:bg-[#38f68faa]":"bg-transparent text-white hover:bg-transparent" }`} onClick={()=>{
                setCurrentPage(1)
                setTransfers('user')
            }}>
              <p className='max-sm:hidden'>User Transfers</p>
              <p className='sm:hidden'>User</p>
            </Button>
                <Button className={`text-[10px] md:text-[18px] rounded-none ${transfers == 'burnt' ? "bg-[#38f28f] text-black hover:bg-[#38f68faa]":"bg-transparent text-white hover:bg-transparent" }`} onClick={()=>{
                    setTransfers('burnt')
                    setCurrentPage(1)
                }}>Burnt</Button>
            </div>
            <div className="-m-1.5 w-full">
              <div className="inline-block min-w-full p-1.5 align-middle">
                <div className="overflow-hidden">
                  <div className="max-w-[90vw] overflow-x-auto  md:max-w-full max-h-[500px] overflow-y-auto scroll-bar-custom">
                    {
                      globalIsPending || userIsPending || burntIsPending ? <div className='w-full h-full grid place-items-center p-3'>
                          <Loader2 className='animate-spin w-5 h-5 text-[#38f68f]'  />
                      </div>:<table className="min-w-full divide-y divide-[#38F68F] text-[#A7B0AF]">
                      <thead className="text-[10px] sm:text-[16px]">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start  font-medium uppercase text-[#A7B0AF]"
                          >
                            Sender ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start  font-medium uppercase text-[#A7B0AF]"
                          >
                            Receiver ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start  font-medium uppercase text-[#A7B0AF]"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-end  font-medium uppercase text-[#A7B0AF]"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-end  font-medium uppercase text-[#A7B0AF]"
                          >
                            Time
                          </th>
                        </tr>
                      </thead>
                      
                        
                        <tbody className='text-[12px] sm:text-[16px] '>
                        {txns?.map(
                          (transaction, index) => (
                            <tr key={index} >
                              <td className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4  font-medium  ${userName(transaction.from).toLocaleLowerCase() === 'tokenwale'? 'text-[#38F68F]' : 'text-white'}`}>
                                {userName(transaction.from)}
                              </td>
                              <td className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4  font-medium ${userName(transaction.to).toLocaleLowerCase() === 'burnt'? 'text-red-500' : 'text-white'}`}>
                                {userName(transaction.to)}
                              </td>
                              <td className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4  ${userName(transaction.from).toLocaleLowerCase() === 'tokenwale'? 'text-[#38F68F]' : userName(transaction.to).toLocaleLowerCase() === 'burnt'? 'text-red-500' : 'text-white'} `}>
                                {transaction.amount}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4 text-end text-white">
                                {
                                  formatFirestoreTimestamp(
                                    transaction.timestamp,
                                  )?.date
                                }
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4 text-end text-white">
                                {
                                  formatFirestoreTimestamp(
                                    transaction.timestamp,
                                  )?.time
                                }
                              </td>
                            </tr>
                          ),
                        )}
                        {txns.length == 0 && (
                          <tr>
                            <td className=' py-4 text-gray-500 italic text-center'>
                              No Transactions on this page
                            </td>
                            <td className=' py-4 text-gray-500 italic text-center'>
                              N/A
                            </td>
                            <td className=' py-4 text-gray-500 italic text-center'>
                              N/A
                            </td>
                            <td className=' py-4 text-gray-500 italic text-center'>
                              N/A
                            </td>
                            <td className=' py-4 text-gray-500 italic text-center'>
                              N/A
                            </td>
                          </tr>
                        )}
                      </tbody>
                      
                    </table>
                    }
                  </div>
                  
                  <div className="flex w-full items-center md:flex-row md:justify-between mb-18">
                    <div className="flex w-full items-center gap-2 text-white px-3">
                      <label className="text-[12px] sm:text-md">Show rows:</label>
                      <select
                        name="page_number"
                        className="rounded-[10px] text-[12px] sm:text-md border-none bg-[#38F68F] bg-opacity-25 px-2 sm:px-4 py-1 text-white outline-none"
                        onChange={(e) => {
                          setCurrentPage(1);
                          setRows(e.target.value ? Number(e.target.value) : 10);
                        }}
                      >
                        {[3,6,9].map((number) => (
                          <option
                            key={number}
                            className="text-black text-[0.6rem] sm:text-md"
                            value={number}
                          >
                            {number}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4 flex w-1/3 items-center justify-between">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="cursor-pointer rounded px-2 sm:px-4 sm:py-2 text-white hover:bg-gray-800"
                      >
                        &lt;
                      </button>
                      <div className="flex gap-2">
                        <button
                          className={`rounded px-4 sm:py-2 text-green-500`}
                          disabled={true}
                        >
                          {currentPage}
                        </button>
                      </div>
                      <button
                        onClick={handleNextPage}
                        className="cursor-pointer rounded px-2 sm:px-4 sm:py-2 text-white hover:bg-gray-800"
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default RecentTransfer