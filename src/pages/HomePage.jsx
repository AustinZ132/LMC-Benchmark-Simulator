import React from 'react';
import Hero from '../components/Hero';
import Editor from '../components/Editor';
import Benchmark from '../components/Benchmark';
import Metrics from '../components/Metrics';
import Charts from '../components/Charts';
import Export from '../components/Export';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Editor />
      <Benchmark />
      <Metrics />
      <Charts />
      <Export />
    </>
  );
}
