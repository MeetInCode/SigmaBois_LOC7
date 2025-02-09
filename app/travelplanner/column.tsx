"use client";  
import { useDrop } from "react-dnd";

interface Task {
  id: string;
  content: string;
  color: string;
}

interface ColumnProps {
  columnId: string;
  column: { name: string; items: Task[] };
  moveTask: (taskId: string, sourceColumnId: string, destinationColumnId: string, destinationIndex: number) => void;
  addTask: (columnId: string) => void;
  deleteColumn: (columnId: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
}

export default function Column({ columnId, column, addTask, deleteColumn, deleteTask }: ColumnProps) {
  return (
    <div className="p-4 border rounded-md w-64 bg-gray-100">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">{column.name}</h2>
        <button onClick={() => deleteColumn(columnId)} className="text-red-500">🗑</button>
      </div>

      {column.items.map((task) => (
        <div key={task.id} className="p-2 mt-2 rounded shadow" style={{ backgroundColor: task.color }}>
          {task.content}
          <button onClick={() => deleteTask(columnId, task.id)} className="ml-2 text-red-500">×</button>
        </div>
      ))}

      <button onClick={() => addTask(columnId)} className="mt-2 p-1 bg-green-500 text-white rounded">
        + Add Task
      </button>
    </div>
  );
}
