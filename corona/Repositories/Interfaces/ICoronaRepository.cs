using corona.Entities;
using corona.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.Repositories.Interfaces
{
    public interface ICoronaRepository : IBaseRepository<CoronaRecord>
    {
        public Task UpdateTimelineRecord(string code, TimelineRecord record);
        public Task<CoronaRecord> GetOne(string code, int timeLineLimit);

        public Task<List<CoronaRecord>> GetAll(int timeLineLimit);

        public Task<CoronaRecord> GetWorldRecord(int limit);




    }
}
