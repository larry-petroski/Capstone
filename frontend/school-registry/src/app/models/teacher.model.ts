import { Student } from "./student.model";

export interface Teacher {
    teacherId: number;
    teacherName: string;
    gradeName: string;
    teacherPhone: string;
    teacherEmail: string;
    maxClassSize: number;
    students?: Student[];
}
