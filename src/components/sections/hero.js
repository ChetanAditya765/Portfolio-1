import React, { useState, useEffect, Suspense } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

// Lazy load Globe to avoid SSR issues
const Globe = React.lazy(() => import('react-globe.gl'));

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;
  position: relative;
  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }
  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;
    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }
  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }
  p {
    margin: 20px 0 0;
    max-width: 540px;
  }
  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
  .globe-container {
    position: absolute;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
    width: 300px;
    height: 300px;
    @media (max-width: 768px) {
      width: 200px;
      height: 200px;
    }
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 480);
    };
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hi, this is</h1>;
  const two = <h2 className="big-heading">Chetan Aditya</h2>;
  const three = <h3>Engineering Intelligence for Tomorrow.</h3>;
  const four = (
    <p>
      A software engineer passionate about AI/ML. With experience from internships at Google and
      AWS, I’ve worked on predictive modeling and real-world AI challenges. I actively contribute to
      open-source projects and lead initiatives promoting innovation, with impactful projects.
    </p>
  );
  const five = (
    <a className="email-link" href="/resume.pdf" target="_blank" rel="noreferrer">
      Check out my resume
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
      {!isMobile && (
        <div className="globe-container">
          <Suspense fallback={<div></div>}>
            <Globe
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              backgroundColor="rgba(0, 0, 0, 0)"
              width={300}
              height={300}
            />
          </Suspense>
        </div>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
