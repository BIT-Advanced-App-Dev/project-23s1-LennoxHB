import { useGetLobbies } from "../functions/game"

export default function List({ child: Child, dbRef }) {    
    const data = useGetLobbies(dbRef)

    return (
        <>
            {data.map((item) => {
                return (
                    <Child key={item.id} data={item} />
                )
            })}
        </>
    )
}