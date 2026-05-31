import { ClipLoader } from "react-spinners";
import Spinner from "@/app/_components/Spinner";

function loading() {
    return (
        <div className="grid justify-center items-center">
            <Spinner />
            <p>Loading cabins ...</p>
        </div>
    );
}

export default loading;
