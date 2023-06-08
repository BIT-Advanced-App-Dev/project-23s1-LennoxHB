import { useOnSnapshot } from "../functions/crud"

export default function List({ child: Child, dbRef }) {    
    const data = useOnSnapshot(dbRef)

    return (
        <>
            {data.map((item) => {
                return (
                    <Child key={item.name} data={item} />
                )
            })}
        </>
    )
}