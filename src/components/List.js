import { useOnSnapshot } from "../functions/crud"

export default function List({ child: Child, dbRef }) {    
    const data = useOnSnapshot(dbRef)

    return (
        <>
            {data.map((item) => {
                console.log(item)
                return (
                    <Child data={{...item, key: item.id}} />
                )
            })}
        </>
    )
}