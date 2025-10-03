import React from "react";
import { useNavigate } from "react-router-dom";
import { Scale } from "lucide-react";

const Logo = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };

    return (
        <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleClick}
        >
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-serif tracking-tight">LAW</h1>
        </div>
    );
};

export default Logo;

