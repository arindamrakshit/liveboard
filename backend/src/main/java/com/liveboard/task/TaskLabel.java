package com.liveboard.task;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "task_labels")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TaskLabel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 7)
    private String color;
}
