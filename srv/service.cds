using { my.company as db} from '../db/schema';

service MyService {

    entity Products as projection on db.Products;

}