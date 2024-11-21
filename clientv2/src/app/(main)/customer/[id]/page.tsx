"use client"
import { ICustomer, IBranch } from "@/interfaces"
import { getCustomerByIdService, getCustomerRelationsById } from "@/services/customer.service"
import { useParams, useSearchParams } from "next/navigation"
import {  useEffect, useMemo, useState } from "react"
import { CustomerBranchList } from "../../../../components/branch/branch-list"
import { getBranchRelationsById } from "@/services/branch.service"
import { useBranchStore } from "@/stores/branch-store"
import { Branch } from "../../../../components/branch/branch"
import Link from "next/link"
import { useUserStore } from "@/stores"
import { useCustomerStore } from "@/stores/customer-store"

export default function CustomerPage() {

    const { id } = useParams()
    const searchParams = useSearchParams()
    const {user} = useUserStore(state => state)
    const queryParams = useMemo(() => searchParams, [searchParams])
    const [relations, setRelations] = useState<IBranch[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const  {customer, setCustomer} = useCustomerStore(state => state)
    const { branch, setBranch, setBranchRelations } = useBranchStore(state => state)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        (async () =>{
            setIsLoading(true)
            const customerID = user?.authority === 'CUSTOMER_USER' ? user?.customerId.id : id
            const [customer, relations] = await Promise.all([
                getCustomerByIdService(customerID as string),
                getCustomerRelationsById(customerID as string)
            ])
            setIsLoading(false)
            if (!customer.success || !relations.success) {
                setHasError(true)
                return
            }
            setCustomer(customer.data)
            setRelations(relations.data)
            if (queryParams.has('branch')) {
                const branchId = queryParams.get('branch')
                const branch = relations.data?.find(relation => relation.to.id === branchId)
                setBranch(branch!)
            } else {
                setBranch(null)
            }
        })()
    }, [id, searchParams])

    useEffect(() => {
        if (branch) {
            setIsLoading(true)
            getBranchRelationsById(branch.id).then((response) => {
                setIsLoading(false)
                if (response.success) {
                    console.log(response.data)
                    setBranchRelations(response.data)
                } else {
                    const urlSearchParams = new URLSearchParams(window.location.search)
                    urlSearchParams.delete('branch')
                    window.history.pushState({}, '', `${window.location.pathname}?${urlSearchParams.toString()}`)
                    setBranch(null)

                }
            })
        } else {
            setBranch(null)
        }
    }, [branch])

    return (
        <>
            {(!hasError && branch ) && <Branch customer={customer!}  isLoading={isLoading}/>}
            {(!hasError && !branch )&& <CustomerBranchList customer={customer!} relations={relations!} isLoading={isLoading} />}
            {hasError && (<div
                className="text-center col-span-4 flex items-center justify-center py-20 h-full">
                <div className="flex flex-col items-center gap-5">
                    <div>
                        <h1 className="font-bold text-neutral-400 text-2xl">Customer or Branch not found</h1>
                        <small className="text-neutral-400">Please check the URL and try again</small>
                    </div>
                    <Link href="/" className="underline">
                        Back to home
                    </Link>
                </div>
            </div>)}

        </>
    )
}
