import React from 'react'
import { useEffect, useState } from "react";
import Card from './Card';
import CardUpdate from './CardUpdate';
import { deleteOne } from '../../service/functionsHTTP';
import CardCreate from './CardCreate';
import "./card.css"

const urlBase = "http://localhost:3000/api/products"

function UserProduct() {

  const [products, setProducts] = useState([])
  const [update, setUpdate] = useState(false)
  const [create, setCreate] = useState(false)
  const [currentProduct, setCurrentProduct] = useState()
  const [state, setState] = useState("")
  const [refresh, setRefresh] = useState(false)



  async function getProducts() {


    const res = await fetch(urlBase)

    if (!res.ok) {
      setState("No hay productos registrados")
      setProducts([])
      return
    }

    const parsed = await res.json();
    setProducts(parsed);
    setRefresh(false)

  }

  useEffect(() => {
    getProducts();
  }, [refresh]);



  async function deleteProducts(idProducts) {

    if (idProducts) {
     deleteOne(idProducts, urlBase)
      setRefresh(true)
    } else {
      return console.log("no se pudo eliminar, anda a saber porque")
    }
  }


  async function selectProducts(product) {
    setUpdate(true)
    setCurrentProduct(product)
  }



  return <>

    {products.length >= 0 ?
      <div>

        <div className='container-btn-crear'>
          <button className='btn-crear' onClick={() => setCreate(true)}>Crear producto</button>
        </div>

        {
          products.length == 0 && create == false ?
            <h1 className='no-hay-productos'>{state}</h1>
            : <></>
        }

        {

          create ?
            <div className='container-cards'>
              <CardCreate setCreate={setCreate} refresh={refresh} setRefresh={setRefresh} ></CardCreate>
            </div>

            :
            <div className='container-cards'>

              {
                update ?
                  <CardUpdate product={currentProduct} refresh={refresh} setUpdate={setUpdate} setRefresh={setRefresh}></CardUpdate>
                  :

                  products.map((product, index) =>

                    <div key={index}>
                      <Card product={product} index={index} button={false}  ></Card>

                      <div className='div-botones'>
                        <button className='btn-eliminar' onClick={() => deleteProducts(product.productId)}>Eliminar</button>
                        <button className='btn-actualizar' onClick={() => selectProducts(product)}>Actualizar</button>
                      </div>
                    </div>
                  )




              }



            </div>
        }


      </div>

      : <h1 className='no-hay-productos'>{state}</h1>
    }
  </>




}



export default UserProduct