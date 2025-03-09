import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Task } from '../model/task/task';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { KanbanService } from '../service/kanban-service.service';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {

  dialogTitle: String;
  kanbanId: String;
  task: Task;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private kanbanService: KanbanService,
    private taskService: TaskService) {

    this.dialogTitle = data.title;
    this.kanbanId = data.kanbanId;
    this.task = data.task;

    this.form = fb.group({
      title: [this.task.title, Validators.required],
      description: [this.task.description, Validators.required],
      dueDate: [this.task.dueDate, Validators.required],
      priority: [this.task.prioritystatus, Validators.required],
      status: [this.task.status, Validators.required]
  });
   }

  ngOnInit() {
  }

  save() {

    this.mapFormToTaskModel();
    if (!this.task.id) {
      this.kanbanService.saveNewTaskInKanban(this.kanbanId, this.task).subscribe();
      console.log("Task created:", this.task);
    } else {
      this.taskService.updateTask(this.task).subscribe();
      console.log("Task updated:", this.task);
    }
    this.dialogRef.close();
    window.location.reload();
  }

  close() {
      this.dialogRef.close();
  } 

  private mapFormToTaskModel(): void {
    this.task.title = this.form.get('title').value;
    this.task.description = this.form.get('description').value;
    this.task.status = this.form.get('status').value;
    const dateVal = this.form.get('dueDate').value;
    this.task.dueDate = new Date(dateVal).toISOString().split('T')[0];
    this.task.prioritystatus = this.form.get('priority').value;

    switch (this.task.prioritystatus) {
      case 'LOW':
        this.task.color = '#7afcff';
        break;
      case 'MEDIUM':
        this.task.color = '#feff9c';
        break;
      case 'HIGH':
        this.task.color = '#ff0000';
        break;
    }
    
  }

}
