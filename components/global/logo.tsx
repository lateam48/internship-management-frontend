import Link from "next/link";

export function Logo() {
    return (
        <Link href="/">
            <h1>
                <span className={"text-primary text-xl font-medium"}>Grady.</span>
            </h1>
        </Link>
    )
}