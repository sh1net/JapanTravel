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
        label: 'photo',
        title: 'Япония',
        img: photo_1
      },
      {
        label: 'photo',
        title: 'это',
        img: photo_2
      },
      {
        label: 'photo',
        title: 'страна',
        img: photo_3
      },
      {
        label: 'photo',
        title: 'с самой',
        img: photo_4
      },
      {
        label: 'photo',
        title: 'необычной',
        img: photo_5
      },
      {
        label: 'photo',
        title: `культурой`,
        img: photo_6
      },
]
  return(
    <div className="content">
        <Slider data={sliderData} />
    </div>
  )
}