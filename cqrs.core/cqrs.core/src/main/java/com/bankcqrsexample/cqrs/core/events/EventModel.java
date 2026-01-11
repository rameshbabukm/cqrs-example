package com.bankcqrsexample.cqrs.core.events;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "eventStore")
public class EventModel {
    @Id
    private String id;
    private Date timeStamp;
    private String aggregateIdentifier;
    private String aggregateType;
    private int version;
    private String eventType;
    private BaseEvent eventData;

    public EventModel() {}

    public EventModel(String id, Date timeStamp, String aggregateIdentifier, String aggregateType, int version, String eventType, BaseEvent eventData) {
        this.id = id;
        this.timeStamp = timeStamp;
        this.aggregateIdentifier = aggregateIdentifier;
        this.aggregateType = aggregateType;
        this.version = version;
        this.eventType = eventType;
        this.eventData = eventData;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Date getTimeStamp() { return timeStamp; }
    public void setTimeStamp(Date timeStamp) { this.timeStamp = timeStamp; }

    public String getAggregateIdentifier() { return aggregateIdentifier; }
    public void setAggregateIdentifier(String aggregateIdentifier) { this.aggregateIdentifier = aggregateIdentifier; }

    public String getAggregateType() { return aggregateType; }
    public void setAggregateType(String aggregateType) { this.aggregateType = aggregateType; }

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public BaseEvent getEventData() { return eventData; }
    public void setEventData(BaseEvent eventData) { this.eventData = eventData; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Date timeStamp;
        private String aggregateIdentifier;
        private String aggregateType;
        private int version;
        private String eventType;
        private BaseEvent eventData;

        public Builder timeStamp(Date timeStamp) { this.timeStamp = timeStamp; return this; }
        public Builder aggregateIdentifier(String aggregateIdentifier) { this.aggregateIdentifier = aggregateIdentifier; return this; }
        public Builder aggregateType(String aggregateType) { this.aggregateType = aggregateType; return this; }
        public Builder version(int version) { this.version = version; return this; }
        public Builder eventType(String eventType) { this.eventType = eventType; return this; }
        public Builder eventData(BaseEvent eventData) { this.eventData = eventData; return this; }

        public EventModel build() {
            return new EventModel(null, this.timeStamp, this.aggregateIdentifier, this.aggregateType, this.version, this.eventType, this.eventData);
        }
    }
}
