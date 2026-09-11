import { GtfsRtEntityRecord } from '../types';

export const GTFS_RT_SPECIFICATION = {
  feedType: 'GTFS-Realtime v2.0 (Google Transit Protocol Buffers)',
  protocol: 'Protocol Buffers (protobuf) over HTTP/2 & WebSockets',
  compression: 'gzip / zstd',
  standardRefreshIntervalSec: 10, // Standard municipal GTFS-RT frequency
  ais140RefreshIntervalSec: 2,   // AIS-140 emergency and telemetry ping rate
  totalMonitoredEntities: 8,
  activeFeedUrl: 'https://api.transit.coimbatore.gov.in/gtfs-rt/vehicle-positions.pb',
  tripUpdateUrl: 'https://api.transit.coimbatore.gov.in/gtfs-rt/trip-updates.pb',
  serviceAlertsUrl: 'https://api.transit.coimbatore.gov.in/gtfs-rt/alerts.pb',
  mqttBroker: 'mqtts://telemetry.auratransit.org:8883',
  mqttTopicPattern: 'fleet/coimbatore/vehicle/{vehicle_id}/ais140',
};

export const TELEMETRY_MAPPING_COMPARISON = [
  {
    simParameter: 'lat / lng',
    gtfsRtField: 'entity.vehicle.position.latitude / longitude',
    ais140Field: 'Packet Field 4,5 ($AIS140,lat,N,lng,E)',
    format: 'WGS-84 Decimal Degrees (Float64)',
    productionValidation: 'Verified via GPS/NavIC transponder dual antenna (accuracy ± 2.5m).',
  },
  {
    simParameter: 'speedKmh',
    gtfsRtField: 'entity.vehicle.position.speed',
    ais140Field: 'Packet Field 7 (Speed in km/h)',
    format: 'Meters per second (GTFS) / km/h (AIS-140)',
    productionValidation: 'Derived from vehicle CAN-bus wheel speed sensors + GPS Doppler velocity.',
  },
  {
    simParameter: 'bearing / heading',
    gtfsRtField: 'entity.vehicle.position.bearing',
    ais140Field: 'Packet Field 8 (Degrees from North 0-359)',
    format: 'Float32 (0.0 to 360.0 degrees)',
    productionValidation: 'Calculated via 3-axis digital magnetic compass + GNSS trajectory.',
  },
  {
    simParameter: 'delayMins',
    gtfsRtField: 'entity.trip_update.stop_time_update.arrival.delay',
    ais140Field: 'Derived via server-side schedule comparator',
    format: 'Integer32 (seconds offset from scheduled timetable)',
    productionValidation: 'Positive integer indicates delay, negative indicates early headway.',
  },
  {
    simParameter: 'confidenceIntervalMin',
    gtfsRtField: 'entity.trip_update.stop_time_update.arrival.uncertainty',
    ais140Field: 'Estimated via Kalman filter covariance matrix',
    format: 'Integer32 (expected variance in seconds at 95% confidence)',
    productionValidation: 'Direct 1:1 mapping: 60s uncertainty = ±1 min confidence band.',
  },
  {
    simParameter: 'occupancyPercent / crowdLevel',
    gtfsRtField: 'entity.vehicle.occupancy_status',
    ais140Field: 'Automated Passenger Counter (APC) optical sensors over RS-485',
    format: 'Enum: EMPTY, MANY_SEATS_AVAILABLE, FEW_SEATS, STANDING_ROOM_ONLY, FULL',
    productionValidation: 'Real-time infrared overhead beam break counters at front and rear entry doors.',
  },
  {
    simParameter: 'status (on_time, delayed, etc.)',
    gtfsRtField: 'entity.trip_update.schedule_relationship',
    ais140Field: 'Transponder Status Code Byte (0x01 Normal, 0x02 Delayed, 0x04 Emergency)',
    format: 'Enum: SCHEDULED, SKIPPED, NO_DATA, REPLACEMENT',
    productionValidation: 'Automatically flags bus holding or detours via geofenced corridor alerts.',
  },
];

export const SAMPLE_GTFS_RT_ENTITIES: GtfsRtEntityRecord[] = [
  {
    id: 'entity-2101',
    entityType: 'VehiclePosition',
    tripId: 'TRIP_21A_0830_UP',
    routeId: 'ROUTE_21A',
    vehicleId: 'TN-38-N-2101',
    lat: 10.9324,
    lng: 76.9632,
    bearing: 142.5,
    speedMps: 8.89, // 32 km/h
    delaySec: 240, // +4 mins
    occupancyStatus: 'MANY_SEATS_AVAILABLE (52% Capacity)',
    timestamp: 1789025400,
    protobufSize: 142,
  },
  {
    id: 'entity-2102',
    entityType: 'TripUpdate',
    tripId: 'TRIP_12B_0845_UP',
    routeId: 'ROUTE_12B',
    vehicleId: 'TN-38-N-1204',
    lat: 10.9612,
    lng: 76.9589,
    bearing: 34.0,
    speedMps: 10.27, // 37 km/h
    delaySec: 120, // +2 mins
    occupancyStatus: 'FEW_SEATS_AVAILABLE (68% Capacity)',
    timestamp: 1789025405,
    protobufSize: 178,
  },
  {
    id: 'entity-2103',
    entityType: 'VehiclePosition',
    tripId: 'TRIP_8C_0820_DN',
    routeId: 'ROUTE_8C',
    vehicleId: 'TN-38-N-0808',
    lat: 10.9455,
    lng: 76.9711,
    bearing: 215.0,
    speedMps: 11.67, // 42 km/h
    delaySec: 0, // On time
    occupancyStatus: 'MANY_SEATS_AVAILABLE (38% Capacity)',
    timestamp: 1789025408,
    protobufSize: 136,
  },
  {
    id: 'entity-2104',
    entityType: 'Alert',
    tripId: 'TRIP_70_0900_EX',
    routeId: 'ROUTE_70',
    vehicleId: 'TN-38-N-7012',
    lat: 10.9982,
    lng: 76.9645,
    bearing: 88.0,
    speedMps: 5.56, // 20 km/h (Slow traffic)
    delaySec: 420, // +7 mins
    occupancyStatus: 'STANDING_ROOM_ONLY (84% Capacity)',
    timestamp: 1789025410,
    protobufSize: 214,
  },
];

export const SAMPLE_RAW_AIS140_PACKET =
  '$AIS140,TN38N2101,1,10.932400,N,076.963200,E,032.4,142.5,110926,102534,A,08,01,052,00,000,00000000*3F';

export const PROTOBUF_DEFINITION_PREVIEW = `
// Protocol Buffers definition: gtfs-realtime.proto
syntax = "proto2";
package transit_realtime;

message FeedMessage {
  required FeedHeader header = 1;
  repeated FeedEntity entity = 2;
}

message FeedEntity {
  required string id = 1;
  optional bool is_deleted = 2 [default = false];
  optional TripUpdate trip_update = 3;
  optional VehiclePosition vehicle = 4;
  optional Alert alert = 5;
}

message VehiclePosition {
  optional TripDescriptor trip = 1;
  optional VehicleDescriptor vehicle = 8;
  optional Position position = 2;
  optional uint32 current_stop_sequence = 3;
  optional string stop_id = 7;
  optional VehicleStopStatus current_status = 4;
  optional uint64 timestamp = 5;
  optional CongestionLevel congestion_level = 6;
  optional OccupancyStatus occupancy_status = 9;
}

message Position {
  required float latitude = 1;
  required float longitude = 2;
  optional float bearing = 3;
  optional double odometer = 4;
  optional float speed = 5; // meters per second
}
`.trim();
