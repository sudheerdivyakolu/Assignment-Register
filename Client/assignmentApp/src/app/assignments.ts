export interface Assign {
    id: String,
    name: String
}

export interface Assignments {
    completedAssignmentList: Assign[],
    incompletedAssignmentList: Assign[],
    deletedAssignmentList: Assign[]
}

export interface Success {
    success: string
}

export interface Failure {
    message: string
}