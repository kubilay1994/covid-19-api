using corona.db;
using corona.Entities;
using corona.Models;
using corona.Repositories.Interfaces;
using corona.Services.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.Services
{
    public class CoronaService : ICoronaService
    {

        private readonly ICoronaRepository _repository;
        public CoronaService(ICoronaRepository repository)
        {
            _repository = repository;
        }

        public Task InsertRecord(CoronaRecord record)
        {
            return _repository.Insert(record);

        }

        public Task<CoronaRecord> GetOne(string code, int timeLineLimit)
        {
            return _repository.GetOne(code, timeLineLimit);
        }

        public Task<List<CoronaRecord>> GetAll(int timeLineLimit)
        {
            return _repository.GetAll(timeLineLimit);
        }

        public Task<CoronaRecord> GetWorldRecord(int limit)
        {
            return _repository.GetWorldRecord(limit);
        }


        public Task UpdateTimeLineRecord(string code, TimelineRecord record)
        {
            return _repository.UpdateTimelineRecord(code, record);
        }


    }

}


