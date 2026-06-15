begin;

alter table public.giving_programs alter column currency set default 'JMD';
alter table public.giving_transactions alter column currency set default 'JMD';

update public.giving_programs set currency = 'JMD' where currency = 'NGN';
update public.giving_transactions set currency = 'JMD' where currency = 'NGN';

commit;
