"use client"

import { Button } from '../../../components/ui/button'
import { LibraryBig, LineChart, MessageCircle, Shield } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Progress } from '../../../components/ui/progress'
import Link from 'next/link'
import { db } from '../../../../configs'
import { JsonForms } from '../../../../configs/schema'
import { desc, eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'

function SideNav() {

    const {user} = useUser()
    const [formList, setFormList] = useState()
    const [percFileCreated, setPercFileCreated] = useState(0)

    const MenuList = [
        {
            id: 1,
            name: "My Forms",
            icon: LibraryBig,
            path: '/dashboard'
        },
        {
            id: 1,
            name: "Responses",
            icon: MessageCircle,
            path: '/dashboard/responses'
        },
        {
            id: 1,
            name: "Analytics",
            icon: LineChart,
            path: '/dashboard/analytics'
        },
        {
            id: 1,
            name: "Upgrade",
            icon: Shield,
            path: '/dashboard/upgrade'
        },
    ]

    const path = usePathname();

    useEffect(() => {
        user && GetFormList()
    }, [user])

    const GetFormList = async() =>{
        const result = await db.select().from(JsonForms)
        .where(eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(JsonForms.id));

        setFormList(result)
        const perc = (result.length/3)*100;
        setPercFileCreated(perc)
    }    

    return (
        <div className='h-screen shadow-md border'>
            <div className='p-5'>
                {
                    MenuList.map((menu, index) => (
                        <Link href={menu.path} className={`flex items-center gap-3 p-4 hover:bg-primary hover:text-gray-500 rounded-lg mb-3 cursor-pointer ${path === menu.path && `bg-primary text-white`}`} key={index}>
                            <menu.icon />
                            {menu.name}
                        </Link>
                    ))
                }
            </div>
            <div className='fixed bottom-7 p-6 w-64'>
                <Button className="w-full">+ Create Form</Button>
                <div className="my-5">
                    <Progress value={percFileCreated} />
                    <h2 className='text-sm mt-2 text-gray-600'><strong>{formList?.length}</strong> out of <strong>3</strong> files Created</h2>
                    <h2 className='text-xs mt-3 text-gray-600'>Upgrade your plan for unlimited access</h2>
                </div>
            </div>
        </div>
    )
}

export default SideNav