/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import DetailProductView from "@/components/views/detailProduct"
import productServices from "@/services/product"
import userServices from "@/services/user"
import { Product } from "@/types/product.type"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"


const DetailProductPage = () => {
    const { id } = useRouter().query
    const session:any = useSession()
    const [product, setProduct] = useState<Product | {} >({})
    const [cart, setCart] = useState([])

    const getDetailProduct = async (id: string) => {
        const { data } = await productServices.getDetailProduct(id)
        setProduct(data.data)
    }

    const getCart = async () => {
        const { data } = await userServices.getCart()
        setCart(data.data)
    }

    useEffect(() => {
        getDetailProduct(id as string)
    }, [id])

    useEffect(() => {
        if(session.data?.accessToken){
            getCart()
        }
    }, [session])

    return (
        <>
            <Head>
                <title>Detail Product | Comms Store</title>
            </Head>
            <DetailProductView product={product} cart={cart} productId={id}/>
        </>
    )
}

export default DetailProductPage