



-- Eliminar el procedimiento si existe
DROP PROCEDURE IF EXISTS sp_InsertAccessLog;


-- Crea Procedure
DELIMITER $$


CREATE PROCEDURE sp_InsertAccessLog(
    IN p_WLIPID INT,
    IN p_Endpoint VARCHAR(255),
    IN p_HttpMethod VARCHAR(255),
    IN p_Browser VARCHAR(255),
    IN p_OS VARCHAR(255),
    IN p_Device VARCHAR(255),
    IN p_UserAgent TEXT,
    IN p_Payload TEXT
)
BEGIN
    DECLARE v_error_code VARCHAR(10);
    DECLARE v_error_message TEXT;
    DECLARE v_error_state VARCHAR(10);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            v_error_code = RETURNED_SQLSTATE,
            v_error_message = MESSAGE_TEXT;
        
        ROLLBACK;
        
        -- Retornar error como JSON
        SELECT JSON_OBJECT(
            'ok', FALSE,
            'message', v_error_message,
        ) AS result;
    END;
    
    START TRANSACTION;
    
    INSERT INTO AccessLogs 
        (WLIPID, Endpoint, HttpMethod, Browser, OS, Device, UserAgent, Payload)
    VALUES 
        (p_WLIPID, p_Endpoint, p_HttpMethod, p_Browser, p_OS, p_Device, p_UserAgent, p_Payload);
    
    COMMIT;
    
    -- Retornar éxito como JSON
    SELECT JSON_OBJECT(
        'ok', TRUE,
        'messagg', 'Regitro creado exitosamente',
    ) AS result;

END$$

DELIMITER;