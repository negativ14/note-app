import { Button } from './ui/Button'
import { IconButton } from './ui/IconButton'
import { FaPenFancy } from 'react-icons/fa'
import { BsImage } from 'react-icons/bs'
import { GoDotFill } from 'react-icons/go'

const NoteInput = () => {
    return (
        <div className="fixed bottom-10 left-100 w-4/5">

            <div className="w-3/4 h-12 bg-white border-2 rounded-4xl flex justify-between items-center p-2 border-gray-300 shadow-2xl">
                <div className="flex gap-x-3">
                    <IconButton variant="simple" icon={FaPenFancy}></IconButton>
                    <IconButton variant="simple" icon={BsImage}></IconButton>
                </div>

                <Button size='md' variant="red" icon={GoDotFill} title="start recording"></Button>
            </div>

        </div>
    )
}

export default NoteInput