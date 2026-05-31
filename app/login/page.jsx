import Footer from "../_components/Footer";
import LoginPage from "./LoginPage";

export const metadata = {
    title: "Login",
};

function page() {
    return (
        <>
            <LoginPage />
            <Footer />
        </>
    );
}

export default page;
