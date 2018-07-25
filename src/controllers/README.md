## Controllers
Mainly to put controllers to handle logic such as DB operations or role checks
  
Planned items:
* Job controller (v1)
    * As per title, basic operations to allow job data entry
    * List all jobs that is assigned to current user (display all for admins)
    * Get 1 job by ID
    * Basic search function by making use of MongoDB (no, not writing a dedicated search index)
    * Create / update / delete job 
    * Soft delete - marking isDeleted to true
* User controller (v1)
    * Restricted module - available only for admins
    * Normal users only able to view their own
    * Admins - Add / edit roles / remove user
    * Normal - allow to edit limited items on their own profile (such as profile name)
    * Role check utils
* Stock controller (v1.1)
    * List all stock available and their audit history
    * For non-admins, audit history is not available    
    * Contains method to deduct stock when used (such as, sold or used in Job parts)
    * Need to insert to StockAudit to keep track of stock change activity
    * Stock adjustment methods for stock reconcilation
* Invoice controller (v1.2)
    * Restricted module - available only for selected user roles
    * Create invoice by billing jobs that is 'DONE' or 'FINISH'
    * Allow to add item from Stock to be sold
