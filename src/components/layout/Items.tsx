import { FaAtlas, FaBook } from "react-icons/fa";
import type { JSX } from "react";

export type NavItem = {
    path: string;
    icon: JSX.Element;
    title: string;
    subTitle?: string;
};

export const Items: NavItem[] = [
    {
        path: "/categories",
        icon: <FaAtlas size={20} />,
        title: "Categorías",
        subTitle: "Explora por temas",
    },
    {
        path: "/courses",
        icon: <FaBook size={20} />,
        title: "Cursos",
        subTitle: "Catálogo completo",
    },
];
