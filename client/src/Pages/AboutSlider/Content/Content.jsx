import photo_1 from "../../../Image/about_worker_1.jpg"
import photo_2 from "../../../Image/about_worker_2.jpg"
import photo_3 from "../../../Image/about_worker_3.jpg"
import photo_4 from "../../../Image/about_worker_4.jpg"
import photo_5 from "../../../Image/about_worker_5.jpg"
import photo_6 from "../../../Image/about_worker_6.jpg"
import { Slider } from '../Slider/Slider'

import "./Content.css"

export default function Content(){
  const sliderData = [
    {
        label: 'CEO AND COFOUNDER, ARKETA',
        title: 'Rachel Lea Fishman',
        img: photo_1
      },
      {
        label: 'CEO AND CO-FOUNDER, FORMA',
        title: 'Jason Fan',
        img: photo_2
      },
      {
        label: 'CEO, OPENAI',
        title: 'Sam Altman',
        img: photo_3
      },
      {
        label: 'SVP OF PRODUCT, JOBBER',
        title: 'Jeff Sheclock',
        img: photo_4
      },
      {
        label: 'HEAD OF STRATEGY, SARDINE',
        title: 'Simon Taylor',
        img: photo_5
      },
      {
        label: 'HEAD OF GLOBAL SALES, STRIPE',
        title: `Eileen O'Mara`,
        img: photo_6
      },
]
  return(
    <div className="content">
        <Slider data={sliderData} />
    </div>
  )
}