import { Dna } from "react-loader-spinner";

export default function Loading() {
    return <div className="absolute top-0 bottom-0 right-0 left-0 bg-gray-950 opacity-80 text-white flex justify-center items-center">
        <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
        />
    </div>
}