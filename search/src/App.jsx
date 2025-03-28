import React from 'react'
import InputSearch from './components/InputSearch'
import ImageGallery from './components/photo'


function App() {

    return (
        <>

            <header>

                <div className="justify-center flex items-center p-4 ">
                    <InputSearch />
                </div>


                <div>
                    <ImageGallery/>
                </div>
            </header>

        </>
    )

}

export default App
