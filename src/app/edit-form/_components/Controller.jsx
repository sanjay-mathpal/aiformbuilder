import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select"
import GradientBg from '../_data/GradientBg'
import Style from '../_data/Style'
import { Button } from '../../../components/ui/button'
import { Checkbox } from '../../../components/ui/checkbox'


function Controller({ selectedTheme, selectedBackground, selectedStyle, setSignInEnable }) {
    const [showMore, setShowMore] = useState(6)
    return (
        <div>
            <h2 className='my-1'>Select Theme</h2>
            <Select onValueChange={(value) => selectedTheme(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="cupcake">Cupcake</SelectItem>
                    <SelectItem value="bumblebee">Bumblebee</SelectItem>
                    <SelectItem value="emerald">Emerald</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="synthwave">Synthwave</SelectItem>
                    <SelectItem value="retro">Retro</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    <SelectItem value="halloween">Halloween</SelectItem>
                    <SelectItem value="garden">Garden</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="aqua">Aqua</SelectItem>
                    <SelectItem value="lofi">Lofi</SelectItem>
                    <SelectItem value="pastel">Pastel</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="wireframe">Wireframe</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="dracula">Dracula</SelectItem>
                    <SelectItem value="cmyk">Cmyk</SelectItem>
                    <SelectItem value="autumn">Autumn</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="acid">Acid</SelectItem>
                    <SelectItem value="lemonade">Lemonade</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="dim">Dim</SelectItem>
                    <SelectItem value="nord">Nord</SelectItem>
                    <SelectItem value="sunset">Sunset</SelectItem>
                </SelectContent>
            </Select>

            <h2 className='mt-8 my-1'>Select Background</h2>
            <div className='grid grid-cols-3 gap-5'>
                {
                    GradientBg.map((bg, index) => (index < showMore) && (
                        <div key={index} onClick={() => selectedBackground(bg.gradient)} className='w-full h-[70px] rounded-lg cursor-pointer hover:border-black hover:border flex items-center justify-center' style={{ background: bg.gradient }}>
                            {index == 0 && 'None'}
                        </div>
                    ))
                }
            </div>
            <Button variant="ghost" size="sm" className="w-full my-1" onClick={() => setShowMore(showMore > 6 ? 6 : 20)}>{showMore > 6 ? 'Show Less' : 'Show More'}</Button>

            <div>
                <label>Border Style</label>
                <div className='grid grid-cols-3'>
                    {Style.map((item) => (
                        <div key={item.id}>
                            <div className='cursor-pointer hover:border-2 rounded-lg' onClick={() => selectedStyle(item.value)}>
                                <h2 className='text-center border-4 m-1'>{item.name}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex gap-2 my-4 items-center mt-10'>
                <Checkbox onCheckedChange={(e)=>setSignInEnable(e)} /> <h2>Enable Social Authentication before submitting the form</h2>
            </div>

        </div>
    )
}

export default Controller