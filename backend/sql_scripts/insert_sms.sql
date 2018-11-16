create or replace procedure insert_sms_penipuan 
(
  vmsisdnpelapor in varchar2 
, vmsisdntarget in varchar2 
, vcontent in varchar2 
, vuserid in varchar2 
, vsource in varchar2 
, vresult out varchar2 
) as 
begin
   INSERT INTO PENIPUAN_DETAIL ("USER_ID", "MSISDN_PELAPOR", "MSISDN_TARGET", "CONTENT", "DATE_TIME", "SOURCE", "LAST_DIGIT") 
  VALUES (vuserid, vmsisdnpelapor,vmsisdntarget, vcontent, SYSDATE, vsource, 1);
end insert_sms_penipuan;



create or replace procedure insert_sms_penipuan 
(
  vmsisdnpelapor in PENIPUAN_DETAIL.MSISDN_PELAPOR%TYPE
, vmsisdntarget in PENIPUAN_DETAIL.MSISDN_TARGET%TYPE
, vcontent in PENIPUAN_DETAIL.CONTENT%TYPE
, vuserid in PENIPUAN_DETAIL.USER_ID%TYPE
, vsource in PENIPUAN_DETAIL.SOURCE%TYPE
, vresult out varchar2 
) as 
begin
   INSERT INTO PENIPUAN_DETAIL ("USER_ID", "MSISDN_PELAPOR", "MSISDN_TARGET", "CONTENT", "DATE_TIME", "SOURCE", "LAST_DIGIT") 
  VALUES (vuserid, vmsisdnpelapor,vmsisdntarget, vcontent, SYSDATE, vsource, 1);
end insert_sms_penipuan;

-- without result
create or replace procedure insert_sms_penipuan2
(
  vmsisdnpelapor in PENIPUAN_DETAIL.MSISDN_PELAPOR%TYPE
, vmsisdntarget in PENIPUAN_DETAIL.MSISDN_TARGET%TYPE
, vcontent in PENIPUAN_DETAIL.CONTENT%TYPE
, vuserid in PENIPUAN_DETAIL.USER_ID%TYPE
, vsource in PENIPUAN_DETAIL.SOURCE%TYPE
) as 
begin
   INSERT INTO PENIPUAN_DETAIL ("USER_ID", "MSISDN_PELAPOR", "MSISDN_TARGET", "CONTENT", "DATE_TIME", "SOURCE", "LAST_DIGIT") 
  VALUES (vuserid, vmsisdnpelapor,vmsisdntarget, vcontent, SYSDATE, vsource, 1);
end insert_sms_penipuan2;



-- how to use
BEGIN
   insert_sms_penipuan('62111111111','6222222222222','ganteng sangat', 'ganteng_123', 'webapps');
END;
