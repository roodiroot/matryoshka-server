import { Project } from "@prisma/client";

export class ProjectResponse implements Project {
    id: number; 
    name: string; 
    teme: string; 
    title: string; 
    description: string; 
    img: string; 
    article: string; 
    reviewId: number; 
    stack: string[];
  };
