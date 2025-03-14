import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Task } from '../model/task/task';
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
  selectedFile: File;

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
    console.log('[TaskDialogComponent] ngOnInit -> task:', this.task);

    // Wenn ein bestehender Task bearbeitet werden soll, laden wir ihn frisch vom Backend
  if (this.task.id) {
    this.taskService.getTaskById(this.task.id.toString()).subscribe({
      next: (updatedTask) => {
        console.log('[ngOnInit()] Aktualisierter Task:', updatedTask);
        this.task = updatedTask;
      },
      error: (err) => {
        console.error('[ngOnInit()] Fehler beim Laden des Tasks:', err);
      }
    });
  }

  }

  save() {
    console.log('[save()] wurde geklickt');
    this.mapFormToTaskModel();
    // Prüfen, ob Task neu oder Update
    if (!this.task.id) {
      console.log('[save()] Neuer Task - POST');
      // Neuer Task
      this.kanbanService.saveNewTaskInKanban(this.kanbanId, this.task).subscribe({
        next: (newTask) => {
          console.log('[save()] Neuer Task erfolgreich gespeichert:', newTask);
        this.task = newTask;

      // Datei Upload?
      console.log('[save()] selectedFile:', this.selectedFile, 'task.id:', this.task.id);
      if (this.selectedFile && this.task.id) {
        this.handleUpload(this.task.id, this.selectedFile);

      } else {
        console.log('[save()] Keine Datei ausgewählt oder keine Task-ID');
        // Falls keine Datei ausgewählt wurde
           this.closeDialog();
      }
    },
    error: (err) => {
      console.error('[save()] Fehler beim Speichern des neuen Tasks:', err);
    }
    }); 
  } else {
     console.log('[save()] Bestehender Task - PUT');
     // Task Update
      this.taskService.updateTask(this.task).subscribe({
        next: (updatedTask) => {
        console.log('[save()] Task aktualisiert:', updatedTask);
        this.task = updatedTask;

        if (this.selectedFile && this.task.id) {
        this.handleUpload(this.task.id, this.selectedFile);
        } else {
          console.log('[save()] Keine Datei ausgewählt oder keine Task-ID');
          this.closeDialog();
        }
      },
      error: (err) => {
        console.error('[save()] Fehler beim Aktualisieren des Tasks:', err);
      }
      });
    }
  }

  close() {
    console.log('[close()] wurde geklickt');
    this.closeDialog();
  }
  
  private closeDialog(): void {
    console.log('[closeDialog()] Dialog wird geschlossen');
    this.dialogRef.close();
    window.location.reload();
  }

  private mapFormToTaskModel(): void {
    console.log('[mapFormToTaskModel()]');
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

  onFileSelected(event: any): void {
    // Datei auswählen
    this.selectedFile = event.target.files[0];
    console.log('[onFileSelected()] selectedFile:', this.selectedFile);
    // Im Frontend-Task-Objekt nur als Vorschau
    // (persistiert erst nach Upload + DB-Speicherung)
    if (this.selectedFile) {
    this.task.uploadedFileName = this.selectedFile.name;
    }
  }

  getFile(taskId: number, filename: string) {
    console.log('[getFile()] -> taskId:', taskId, 'filename:', filename);
    this.taskService.getFile(taskId, filename).subscribe({
      next: (blob) => {
        console.log('[getFile()] Blob erhalten, starte Download:', blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href= url;
        a.download = filename;
        a.click();
        // Speicher wieder freigeben
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('[getFile()] Fehler beim Herunterladen der Datei:', err);
      }
    });
  }

  private handleUpload(taskId: number, selectedFile: File): void {
    console.log('[handleUpload()] Start -> taskId=', taskId, 'File:', selectedFile);

    // Upload-Aufruf
    this.taskService.uploadFileForTask(taskId, selectedFile).subscribe({
      
      next: (returnedFilename) => {
        console.log('[handleUpload()] Datei hochgeladen, returnedFilename:', returnedFilename);
     
        // Frontend-Task-Objekt updaten (temporär)
        this.task.uploadedFileName = returnedFilename;

        // Task erneut vom Backend holen, damit wir den
        // in der DB gespeicherten Dateinamen sehen
        this.taskService.getTaskById(taskId.toString()).subscribe({
          next: (updatedTask) => {
          console.log('[handleUpload()] Aktualisierter Task:', updatedTask);
          this.task = updatedTask;
          
          // Dialog schließen oder reload
          this.closeDialog();
          },
          error: (err) => {
            console.error('[handleUpload()] Fehler beim Holen des aktualisierten Tasks:', err);
          }        
});
      },
      error: (error) => {
        console.error('[handleUpload()] Fehler beim Hochladen der Datei:', error);
          this.closeDialog();
      }
    });
  }
}