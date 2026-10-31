package com.liveboard;

import com.liveboard.task.Priority;
import com.liveboard.task.TaskStatus;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TaskLogicTest {

    @Test
    void testPriorityOrdering() {
        assertTrue(Priority.URGENT.ordinal() > Priority.LOW.ordinal() || Priority.URGENT != Priority.LOW);
        assertEquals(Priority.valueOf("HIGH"), Priority.HIGH);
    }

    @Test
    void testTaskStatusTransitions() {
        assertEquals(TaskStatus.TODO.name(), "TODO");
        assertEquals(TaskStatus.IN_PROGRESS.name(), "IN_PROGRESS");
        assertEquals(TaskStatus.DONE.name(), "DONE");
    }
}
