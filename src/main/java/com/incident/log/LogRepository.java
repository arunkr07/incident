package com.incident.log;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LogRepository extends JpaRepository<Log, Long> {

    List<Log> findByServiceIdOrderByTimestampDesc(Long serviceId);

    List<Log> findByLevelOrderByTimestampDesc(LogLevel level);

    List<Log> findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime from,
            LocalDateTime to
    );
}