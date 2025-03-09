package com.wkrzywiec.medium.kanban.model;

import java.time.LocalDate;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.annotations.ApiModel;
import com.wkrzywiec.medium.kanban.model.PriorityStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

    @ApiModelProperty(position = 1)
    private String title;

    @ApiModelProperty(position = 2)
    private String description;

    @ApiModelProperty(position = 3)
    private String color;

    @ApiModelProperty(position = 4)
    private TaskStatus status;

    @ApiModelProperty(position = 5)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    @ApiModelProperty(position = 6)
    private PriorityStatus prioritystatus;

}
