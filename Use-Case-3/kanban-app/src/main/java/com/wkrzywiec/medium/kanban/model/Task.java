package com.wkrzywiec.medium.kanban.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;

@Data
@Entity
@NoArgsConstructor
@Table(name = "task")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(position = 1)
    private Long id;

    @ApiModelProperty(position = 2)
    private String title;

    @ApiModelProperty(position = 3)
    private String description;

    @ApiModelProperty(position = 4)
    private String color;

    @Enumerated(EnumType.STRING)
    @ApiModelProperty(position = 5)
    private TaskStatus status;

    @ApiModelProperty(position = 6)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @ApiModelProperty(position = 7)
    private PriorityStatus prioritystatus;

    @ElementCollection
    @CollectionTable(name = "task_uploaded_files", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "file_name")
    @ApiModelProperty(position = 8)
    private List<String> uploadedFileNames = new ArrayList<>();
}
