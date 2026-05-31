import Spinner from "@/app/_components/Spinner";

function loading() {
    return (
        <>
            <div className="grid justify-center items-center dark:hidden">
                <Spinner />
            </div>
            <div className="grid justify-center items-center dark:block">
                <Spinner />
            </div>
        </>
    );
}

export default loading;
