using corona.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.db
{
    public class MongoDBContext : IDbContext
    {
        public IMongoClient Client { get; set; }
        public IMongoDatabase Db { get; set; }

        public MongoDBContext(IDbSettings settings)
        {
            Client = new MongoClient(settings.ConnectionString);
            Db = Client.GetDatabase(settings.DatabaseName);
        }


        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return Db.GetCollection<T>(name);

        }
    }


    public interface IDbContext
    {
        IMongoClient Client { get; set; }
        IMongoDatabase Db { get; set; }

        public IMongoCollection<T> GetCollection<T>(string name);
    }
}


