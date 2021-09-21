import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useComercioPresenter } from '../../presenter/comerciosPresenter'
import { useComidaPresenter } from '../../presenter/comidasPresenter'
import Typography from '@material-ui/core/Typography'
import { Carrito } from '../../components/Carrito'
import { ListaProductos } from '../../components/ListaProductos'
import { LinearProgress, Grid, Box } from '@material-ui/core';

const Comercio = () => {

    //Hooks
    const { id } = useParams()
    const { traerComercioPorId } = useComercioPresenter()
    const { comidas, setComidas, traerComidasPorComercio } = useComidaPresenter();

    //Estados
    const [cargando, setCargando] = useState(true);
    const [comercio, setComercio] = useState({})
    const [cartItems, setCartItems] = useState([]);


    //al cargar el componente se trae el comercio por id
    useEffect(() => {
        traerComercioPorId(id).then(data => setComercio(data)).catch(err => console.error(err))
    }, [])

    useEffect(() => {
        if (id !== 8) {
            traerComidasPorComercio(id).then((data) => {
                setComidas(data)
                setCargando(false)
            }).catch(err => console.log(err))
        }
    }, [id])

    useEffect(() => {
        if (comercio) {
            console.log(comercio)
        }
    }, [comercio])

    useEffect(() => {
        console.log("COMIDAS: " + JSON.stringify(comidas))
    }, [comidas])

    const onAdd = (product) => {
        const exist = cartItems.find((x) => x.idProducto === product.idProducto);
        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x.idProducto === product.idProducto ? { ...exist, qty: exist.qty + 1 } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, qty: 1 }]);
        }
    };

    return (
        <div>
            <Box px={5} m={2} display="flex" justifyContent="center">
                <Typography variant="h4" color="initial" style={{ fontWeight: "bold" }}>
                    {comercio ?
                        comercio.nombre
                        : "El comercio no existe"
                    }
                </Typography>
            </Box>
            <Grid container
                direction="row"
                justifyContent="center"
                alignItems="left"
            >
                {
                    !comidas.length ?
                        <LinearProgress />
                        :
                        <ListaProductos comidas={comidas} onAdd={onAdd}></ListaProductos>
                }
                <Carrito
                    telefono={comercio.telefono}
                    cartItems={cartItems}
                    onAdd={onAdd}
                ></Carrito>
            </Grid>
        </div >
    )
}

export default Comercio;