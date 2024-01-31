import React, { useEffect, useState } from 'react'
import { category } from '../../interfaces/category.interface'
import { question } from '../../interfaces/question.interface'
import './homePage.scss'
import { api } from '../../services/apis'
import { useNavigate } from 'react-router-dom'
import { Outlet } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { questionAction } from '../../store/slice/question.slice'
export default function HomePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [category, setCategory] = useState<category[]>([])
    let [display, setDisplay] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                let result: any = await api.category.findAll();
                if (result.status == 200) {
                    setCategory(result.data.data)
                }
            } catch (err) {
                console.log('err', err);

            }
        }
        fetchData()
    }, [])
    const handleGetQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            let result = await api.question.findWithConditon(Number((e.target as any).category.value), Number((e.target as any).level.value), Number((e.target as any).limit.value));
            if (result.status == 200) {
                dispatch(questionAction.setData(result.data.data))
                setDisplay(false)
                navigate('/question_detail')

            }
        } catch (err) {

        }
    }
    return (
        <div className='form_box'>
            {
                display && <div className='form_container'>
                    <h1>Setup Quiz</h1>
                    <form onSubmit={(e) => {
                        handleGetQuestion(e)
                    }}>
                        <p>Number Of Question</p>
                        <input type='number' min='1' defaultValue={1} name='limit'></input>
                        <p>Category</p>
                        <select id="category" defaultValue={category[0]?.id}>
                            {category?.map(item => (
                                <option key={Date.now() * Math.random()} value={item?.id}>{item?.name}</option>
                            ))}
                        </select>
                        <p>Difficulty</p>
                        <select id="level" defaultValue={1}>
                            <option value="1">easy</option>
                            <option value="2">medium</option>
                            <option value="3">difficult</option>
                        </select>
                        <button type='submit'>Start</button>
                    </form>
                </div>
            }

            <Outlet />
        </div>
    )
}
