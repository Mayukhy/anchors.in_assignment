
'use client'
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useGetUrlsQuery } from '@/redux/api/api';
import { setActiveMenue } from '@/redux/slices/urlSlice';
import { Avatar } from '@mui/joy';

interface User {
  _id: string;
  username: string;
  email: string;
}

const Page: FC = () => {
  const { activeMenue } = useSelector((state) => state.url);
  const { data: urls } = useGetUrlsQuery();
  const dispatch = useDispatch();
  const [singleUser, setSingleUser] = useState<User | null>(null);
  const session = useSession();
  const router = useRouter();

  //getting current user data
  useEffect(() => {
    const getSingleUser = async () => {
      await axios.get(`/api/user/${session?.data?.user?.email}`).then(({ data }) => {
        setSingleUser(data);
      });
    };
    getSingleUser();
  }, [session?.data?.user]);

  useEffect(() => {
    dispatch(setActiveMenue("Profile"));
  }, [activeMenue]);

  //filtering those urls which is created by the current user
  const myUrls = urls?.filter((item: any, id: number) => item?.userId === singleUser?._id);

  //finfing the total number of clicks in diff sites
  const totalClicks = myUrls?.reduce((inisialState: number, item: any) => {
    return item?.visitHistory?.length + inisialState;
  }, 0);

  useEffect(() => {
    if (session?.status !== 'authenticated') {
      router.push('/');
    }
  }, [session]);

  return (
    <div className="h-screen flex flex-wrap items-center  justify-center  ">
      <div className="container lg:w-2/5 sm:w-full md:w-2/3 h-[80vh] bg-zinc-200 rounded-2xl shadow-xl  shadow-zinc-400   transform   duration-200 easy-in-out">
        <div className=" h-32 overflow-hidden rounded-t-2xl">
          <img className="w-full rounded-2xl" src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="" />
        </div>
        <div className="flex justify-center px-5  -mt-12">
<Avatar sx={{
  width:'102px',
  height:'102px',
  fontSize:'40px'
}} src={singleUser?.username} alt={singleUser?.username}/>
        </div>
        <div className=" mt-1 ">
          <div className="text-center px-14">
            <h2 className="text-gray-800 text-3xl font-bold">{singleUser?.username || singleUser?.email}</h2>
            <a className="text-gray-400 mt-2 hover:text-blue-500" href="https://github.com/Mayukhy" target="_blank">{singleUser?.email}</a>
            <p className="mt-2 text-gray-500 text-sm">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas, nisi perferendis error, molestias praesentium libero quas sint maiores cupiditate quo culpa enim ipsam ea ullam facilis deserunt placeat quidem excepturi.
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </p>
          </div>
          {/* <hr className="mt-6" /> */}
          <div className=" absolute flex w-full bottom-0 left-0  bg-zinc-800 rounded-b-2xl ">
            <div className="text-center w-1/2 p-4 hover:bg-zinc-900 cursor-pointer">
              <p><span className="font-semibold">{myUrls?.length} </span> Sites</p>
            </div>
            <div className="border"></div>
            <div className="text-center w-1/2 p-4 hover:bg-zinc-900 cursor-pointer">
              <p> <span className="font-semibold">{totalClicks} </span> Clicks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
